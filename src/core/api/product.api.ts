import productsModel, { Product } from '@models/products.model';
import { QueryOptions } from 'mongoose';

class ProductApi {
  static async getAllProducts(): Promise<Product[]> {
    return await productsModel.find({}).lean();
  }

  static async getProductById(id: string): Promise<Product> {
    return await productsModel.findById(id).lean();
  }

  static async getDefaultProduct(): Promise<Product> {
    return await productsModel.findOne({ default: true }).lean();
  }

  static async createProduct(product: Product): Promise<Product> {
    const newProduct = new productsModel(product);
    return await newProduct.save();
  }

  static async updateProduct(
    id: string,
    product: Partial<Product>,
    options: QueryOptions = {},
  ): Promise<Product> {
    return await productsModel
      .findByIdAndUpdate(id, product, {
        new: true,
        ...options,
      })
      .lean();
  }

  static async deleteProduct(id: string): Promise<Product> {
    return await productsModel.findByIdAndDelete(id).lean();
  }
}

Object.freeze(ProductApi);
export default ProductApi;
