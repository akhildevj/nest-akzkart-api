import { BadRequestException, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { DatabaseService } from 'src/database/database.service';
import { MessageDto } from 'src/models/message.dto';
import { UserIdDto } from 'src/models/user-id.dto';
import {
  ADD_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGE,
  INVALID_ID,
  UPDATE_MESSAGE,
} from 'src/shared/constants';
import {
  addProductQuery,
  deleteProductQuery,
  getAllProductsQuery,
  getProductDetailsQuery,
  updateProductQuery,
  updateproductRatingQuery,
} from './db-queries/product.query';
import {
  AllProductsResponseDto,
  ProductBodyDto,
  ProductDetailsResponseDto,
  ProductDto,
  ProductIdDto,
  productRatingBodyDto,
} from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService<any>) {}

  getProducts(): Observable<AllProductsResponseDto | Record<null, null>> {
    return this.databaseService
      .rawQuery(getAllProductsQuery, [], ProductDto)
      .pipe(
        map(products => ({ success: true, message: GET_MESSAGE, products })),
      );
  }

  getProductDetails(
    params: ProductIdDto,
  ): Observable<ProductDetailsResponseDto | Record<null, null>> {
    return this.databaseService
      .rawQuery(getProductDetailsQuery, [params.id], ProductDto)
      .pipe(
        map(rows => {
          if (!rows.length) throw new BadRequestException(INVALID_ID);
          return { success: true, message: GET_MESSAGE, product: rows[0] };
        }),
      );
  }

  addProduct(
    params: UserIdDto,
    body: ProductBodyDto,
  ): Observable<MessageDto | Record<null, null>> {
    const { id } = params;
    const { name, price, imageUrl, description } = body;

    return this.databaseService
      .rawQuery(
        addProductQuery,
        [name, price, imageUrl, description, id],
        ProductDto,
      )
      .pipe(map(() => ({ success: true, message: ADD_MESSAGE })));
  }

  updateProduct(
    params: ProductIdDto,
    body: ProductBodyDto,
  ): Observable<MessageDto | Record<null, null>> {
    const { id } = params;
    const { name, price, imageUrl, description } = body;

    return this.databaseService
      .rawQuery(
        updateProductQuery,
        [id, name, price, imageUrl, description],
        ProductDto,
      )
      .pipe(
        map(rows => {
          if (!rows.length) throw new BadRequestException(INVALID_ID);
          return { success: true, message: UPDATE_MESSAGE };
        }),
      );
  }

  removeProduct(
    params: ProductIdDto,
  ): Observable<MessageDto | Record<null, null>> {
    return this.databaseService
      .rawQuery(deleteProductQuery, [params.id], ProductDto)
      .pipe(
        map(rows => {
          if (!rows.length) throw new BadRequestException(INVALID_ID);
          return { success: true, message: DELETE_MESSAGE };
        }),
      );
  }

  updateProductRating(
    params: ProductIdDto,
    body: productRatingBodyDto,
  ): Observable<MessageDto | Record<null, null>> {
    const { id } = params;
    const { productId, rating } = body;

    return this.databaseService
      .rawQuery(updateproductRatingQuery, [id, productId, rating], ProductDto)
      .pipe(
        map(rows => {
          if (!rows.length) throw new BadRequestException(INVALID_ID);
          return { success: true, message: UPDATE_MESSAGE };
        }),
      );
  }
}
