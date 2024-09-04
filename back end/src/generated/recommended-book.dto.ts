import { ApiProperty } from "@nestjs/swagger";

export class RecommendedBookDto {
  @ApiProperty({
    type: "string",
    format: "date-time",
    required: false,
  })
  createdAt: Date;
}
