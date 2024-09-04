import { BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { Order } from '../enum/order.enum';

export const IsOrderQueryParam = (
  property: string,
  orderFieldEnumType: any,
  validationOptions?: ValidationOptions,
) => {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'IsOrderQueryParam',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any) {
          const [field, orderDirection] = value.split(':');

          if (!Object.values(Order).includes(orderDirection) || !Object.values(orderFieldEnumType).includes(field))  {
            throw new BadRequestException("Please enter the right field and direction to sort by order")
          }
          return true;
        },
      },
    });
  };
};
