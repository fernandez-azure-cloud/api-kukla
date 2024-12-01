import { Injectable, PipeTransform } from '@nestjs/common';
import { ZodObject, ZodRawShape, z } from 'zod';

@Injectable()
export class ValidationPipe<T extends ZodRawShape> implements PipeTransform {
  constructor(
    private readonly schema: z.ZodObject<T> | z.ZodEffects<ZodObject<T>>,
  ) {}

  transform(value: T) {
    return this.schema.parse(value);
  }
}
