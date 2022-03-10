import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import mappedErrors from '@utils/mapped-errors';

import ProductDto from '@dto/product.dto';
import ProductGroupDto from '@dto/product-group.dto';
import { Product } from '@models/product.model';
import { ProductGroup } from '@models/product-group.model';

import ProductApi from '@core/api/product.api';
import { isValidObjectId } from 'mongoose';

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await ProductApi.getAllProducts();
  // get product groups
  const productGroups = await ProductApi.getAllProductGroups();

  res.render('admin/products/index', {
    products,
    productGroups,
  });
};

export const getAddProduct = async (_req: Request, res: Response) => {
  res.render('admin/products/add-edit');
};

export const getEditProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/products');

  const product = await ProductApi.getProductById(id);

  if (!product) return res.redirect('/admin/products');

  res.render('admin/products/add-edit', {
    edit: true,
    product,
  });
};

export const postAddProduct = async (req: Request, res: Response) => {
  const product = plainToInstance(ProductDto, req.body);
  const errors = await validate(product);
  if (errors.length > 0) {
    return res.render('admin/products/add-edit', {
      errors: mappedErrors(errors),
      product,
    });
  }
  await ProductApi.createProduct(product);

  res.redirect('/admin/products');
};

export const postEditProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/products');

  const bodyObj = { ...req.body };
  const product = plainToInstance(ProductDto, bodyObj);

  const errors = await validate(product);

  if (errors.length > 0) {
    return res.render('admin/products/add-edit', {
      errors: mappedErrors(errors),
      product,
      edit: true,
    });
  }

  await ProductApi.updateProduct(id, product as Product);

  res.redirect('/admin/products');
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!isValidObjectId(id)) return res.redirect('/admin/products');
  await ProductApi.deleteProduct(id);
  res.redirect('/admin/products');
};

export const getAddGroup = async (_req: Request, res: Response) => {
  return res.render('admin/products/add-edit-group');
};

export const postAddGroup = async (req: Request, res: Response) => {
  const group = plainToInstance(ProductGroupDto, req.body);
  const errors = await validate(group);
  if (errors.length > 0) {
    return res.render('admin/products/add-edit-group', {
      errors: mappedErrors(errors),
      group,
    });
  }
  await ProductApi.createProductGroup(group as ProductGroup);

  res.redirect('/admin/products');
};

export const editGroup = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/products');

  const group = plainToInstance(ProductGroupDto, req.body);
  const errors = await validate(group);

  if (errors.length > 0) {
    return res.render('admin/products/add-edit-group', {
      errors: mappedErrors(errors),
      group,
      editGroup: true,
    });
  }

  await ProductApi.updateProductGroup(id, group as ProductGroup);

  res.redirect('/admin/products');
};
