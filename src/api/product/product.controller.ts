import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AllProductsResponseDto,
  MessageDto,
  ProductBodyDto,
  ProductDetailsResponseDto,
  ProductIdDto,
} from './dto/product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getProducts(): Observable<AllProductsResponseDto[] | Record<null, null>> {
    return this.productService.getProducts();
  }

  @Get(':id')
  getProductDetails(
    @Param() params: ProductIdDto,
  ): Observable<ProductDetailsResponseDto | Record<null, null>> {
    return this.productService.getProductDetails(params);
  }

  @Post()
  addProduct(
    @Body() body: ProductBodyDto,
  ): Observable<MessageDto | Record<null, null>> {
    return this.productService.addProduct(body);
  }

  @Patch(':id')
  updateProduct(
    @Param() params: ProductIdDto,
    @Body() body: ProductBodyDto,
  ): Observable<MessageDto | Record<null, null>> {
    return this.productService.updateProduct(params, body);
  }

  @Delete(':id')
  removeProduct(
    @Param() params: ProductIdDto,
  ): Observable<MessageDto | Record<null, null>> {
    return this.productService.removeProduct(params);
  }
}
