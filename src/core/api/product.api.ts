import productsModel, { Product } from '@models/product.model';
import productGroupModel, { ProductGroup } from '@models/product-group.model';

import { QueryOptions } from 'mongoose';
import ProductDto from '@dto/product.dto';

class ProductApi {
  static async getAllProducts(): Promise<Product[]> {
    return await productsModel.find({}).populate('group').lean();
  }

  static async getProductById(id: string): Promise<Product> {
    return await productsModel.findById(id).lean();
  }

  static async getDefaultProduct(): Promise<Product> {
    return await productsModel.findOne({ default: true }).lean();
  }

  static async createProduct(product: ProductDto): Promise<Product> {
    const newProduct = new productsModel(product);
    return await newProduct.save();
  }

  static async updateProduct(
    id: string,
    product: Partial<Product>,
    options: QueryOptions = {},
  ): Promise<Product> {
    return await productsModel
      .findByIdAndUpdate(
        id,
        { $set: product },
        {
          new: true,
          ...options,
        },
      )
      .lean();
  }

  static async deleteProduct(id: string): Promise<Product> {
    return await productsModel.findByIdAndDelete(id).lean();
  }

  static async getProductGroupById(id: string): Promise<ProductGroup> {
    return await productGroupModel.findById(id).lean();
  }

  static async getProductGroupBySlug(slug: string): Promise<ProductGroup> {
    return await productGroupModel.findOne({ slug }).lean();
  }

  static async getAllProductGroups(): Promise<ProductGroup[]> {
    return await productGroupModel.find({}).lean();
  }

  static async createProductGroup(
    productGroup: ProductGroup,
  ): Promise<ProductGroup> {
    const newProductGroup = new productGroupModel(productGroup);
    return await newProductGroup.save();
  }

  static async updateProductGroup(
    id: string,
    productGroup: Partial<ProductGroup>,
  ): Promise<ProductGroup> {
    return await productGroupModel
      .findByIdAndUpdate(id, { $set: productGroup }, { new: true })
      .lean();
  }

  static async deleteProductGroup(id: string): Promise<ProductGroup> {
    // check if any product is using this group
    const product = await productsModel.findOne({ group: id });
    if (product) {
      throw new Error('This group is in use');
    }
    return await productGroupModel.findByIdAndDelete(id).lean();
  }
}

Object.freeze(ProductApi);
export default ProductApi;
