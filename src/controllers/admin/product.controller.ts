import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { isValidObjectId } from 'mongoose';

import mappedErrors from '@utils/mapped-errors';
import ProductDto from '@dto/product.dto';
import ProductGroupDto from '@dto/product-group.dto';
import { Product } from '@models/product.model';
import { ProductGroup } from '@models/product-group.model';
import ProductApi from '@core/api/product.api';

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await ProductApi.getAllProducts();
  const productGroups = await ProductApi.getAllProductGroups();

  res.render('admin/products/index', {
    products,
    productGroups,
  });
};

export const getAddProduct = async (_req: Request, res: Response) => {
  const groups = await ProductApi.getAllProductGroups();
  res.render('admin/products/add-edit', {
    groups,
    product: new ProductDto(),
  });
};

export const getEditProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) return res.redirect('/admin/products');

  const product = await ProductApi.getProductById(id);
  const groups = await ProductApi.getAllProductGroups();

  if (!product) return res.redirect('/admin/products');

  res.render('admin/products/add-edit', {
    edit: true,
    product,
    groups,
  });
};

export const postAddProduct = async (req: Request, res: Response) => {
  const productInput = plainToInstance(ProductDto, {
    ...req.body,
    group: '622a00966a1a8eadda16cebb', // TODO: remove hardcoded id
  });

  const errors = await validate(productInput);

  if (errors.length > 0) {
    return res.status(422).json({
      status: 'error',
      data: null,
      errors: mappedErrors(errors),
      productInput,
    });
  }

  const createdProduct = await ProductApi.createProduct({
    ...req.body,
    group: '622a00966a1a8eadda16cebb',
  });

  if (!createdProduct)
    return res.status(400).json({
      status: 'error',
      data: null,
      errors: {
        message: 'Product not created',
      },
      productInput,
    });

  return res.status(201).json({
    status: 'success',
    data: {
      product: createdProduct,
    },
  });
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

  res.status(200).json({
    status: 'success',
    data: { product },
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.body.productId;

  if (!isValidObjectId(id)) {
    req.flash('error', 'Product not found');
    return res.status(400).redirect('/admin/products');
  }

  await ProductApi.deleteProduct(id);

  res.status(204).redirect('/admin/products');
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
