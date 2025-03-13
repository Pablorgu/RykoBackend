import { Injectable, NotFoundException } from '@nestjs/common';
import { FoodItem } from './foodItem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchByNameFoodItemDto } from './dto/searchByNameFoodItem.dto';

@Injectable()
export class FoodItemService {
   constructor(
      @InjectRepository(FoodItem)
      private readonly foodItemRepository: Repository<FoodItem>) { }
   
      //Return a fooditem by its barcode
   async findOneByBarcode(barcode: number): Promise<FoodItem | null> {
      const food = await this.foodItemRepository.findOne({ where: { barcode } });
      return food;
   }


   //Get a food item by its barcode, if it is in the database it returns the fooditem, if it isn´t it searches it in the api of itemfoodfacts and save it into de database, returning the fooditem
   async deepFind(barcode: number): Promise<FoodItem> {
      //Search the fooditem in the database
      const food = await this.findOneByBarcode(barcode);
      //If the fooditem is in the database return it
      if (food) {
         food.lastCheck = new Date();
         await this.foodItemRepository.save(food);
         return food;
         //tengo que actualizar la fecha de lastcheck
      }else {
         //If the fooditem is not in the database search it in the api of openfoodfacts
         //Get the data from the api
         const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}`);
         const data = await response.json();
         //If the api returns an error, return null
         if (data.status === 0) {
            throw new NotFoundException(`Food item with barcode ${barcode} not found`);
         }
         //If the api returns a fooditem, save it into the database and return it
         const foodItem = {
            barcode: data.code,
            name: data.product.product_name_en,
            brand: data.product.brands,
            packageQuantity: +data.product.product_quantity,
            allergens: data.product.allergens,
            ingredients: data.product.ingredients_text,
            glutenFree: data.product.labels.includes("No gluten") ? true : false,
            vegan: data.product.labels.includes("vegan") ? true : false,   
            vegetarian: data.product.labels.includes("vegetarian") ? true : false,
            palmOil: data.product.labels.includes("palm oil") ? true : false,
            imageFrontSmallUrl: data.product.image_front_small_url,
            imageFrontThumbUrl: data.product.image_front_thumb_url,
            imageFrontUrl: data.product.image_front_url,
            imageUrl: data.product.image_url,
            nutriscore: data.product.nutriscore_grade,
            energyKcal: data.product.nutriments['energy-kcal_100g'],
            energyKj: data.product.nutriments['energy_100g'],
            carbohydrates: data.product.nutriments['carbohydrates_100g'],
            fat: data.product.nutriments['fat_100g'],
            proteins: data.product.nutriments['proteins_100g'],
            saturatedFat: data.product.nutriments['saturated-fat_100g'],
            fiber: data.product.nutriments['fiber_100g'],
            salt: data.product.nutriments['salt_100g'],
            alcohol: data.product.nutriments.alcohol,
            sodium: data.product.nutriments['sodium_100g'],
            sugars: data.product.nutriments['sugars_100g'],
            novaGroup: data.product.nova_group,
            additives: data.product.additives_tags ? data.product.additives_tags.join(',') : null,
            lastCheck: new Date(),
            isPersonal: false
         };
         console.log('FoodItem data:', foodItem);
         const newFoodItem = this.foodItemRepository.create(foodItem);
         await this.foodItemRepository.save(newFoodItem);
         return newFoodItem;
      }
   }

   //Get a list of items from de OpenFoodFacts API by its name
   async searchProducts(query: string): Promise<any[]> {
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1`);
      const data = await response.json();
    
      // Be sure that the response is an array
      if (!data.products || !Array.isArray(data.products)) {
        return [];
      }
    
      // Map the results to a simpler format
      const results: SearchByNameFoodItemDto[] = data.products.map((prod: any) => ({
        barcode: prod.code,
        name: prod.product_name || prod.product_name_en,
        brand: prod.brands,
        imageUrl: prod.image_url || prod.image_front_url,
      }));
    
      return results;
    }

   ///////////////////////////////////////////////////////////////////////////////////////////////////
   //FROM HERE ONWARDS THE METHODS ARE FOR PERSONAL FOODITEMS THAT IM NOT SURE IF IT WILL BE USED
   ///////////////////////////////////////////////////////////////////////////////////////////////////
   //Post a new fooditem into the database
   async create(foodItem: FoodItem): Promise<FoodItem> {
      const newFoodItem = this.foodItemRepository.create(foodItem);
      foodItem.lastCheck = new Date();
      foodItem.isPersonal = true;
      await this.foodItemRepository.save(newFoodItem);
      return newFoodItem;
   }

   //Update a personal fooditem
   async update(foodItem: FoodItem): Promise<FoodItem> {
      const food = await this.findOneByBarcode(foodItem.barcode);
      if (!food) {
         throw new NotFoundException(`Food item with barcode ${foodItem.barcode} not found`);
      }   
      if (food.isPersonal === false) {
         throw new NotFoundException(`Food item with barcode ${foodItem.barcode} is not personal`);
      }
      const updatedFoodItem = await this.foodItemRepository.save(foodItem);
      return updatedFoodItem;
   }

   //Delete a personal fooditem
   async delete(barcode: number): Promise<void> {
      const foodItem = await this.findOneByBarcode(barcode);
      if (!foodItem) {
         throw new NotFoundException(`Food item with barcode ${barcode} not found`);
      }
      if (foodItem.isPersonal === false) {
         throw new NotFoundException(`Food item with barcode ${barcode} is not personal`);
      }
      await this.foodItemRepository.remove(foodItem);
   }


}
