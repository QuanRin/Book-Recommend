import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "./user.entity";
import { BookEntity } from "./book.entity";

export class RecommendedBookEntity {
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  bookId: string;
  @ApiProperty({
    type: "string",
    format: "date-time",
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  user?: UserEntity;
  @ApiProperty({
    required: false,
  })
  book?: BookEntity;
}
