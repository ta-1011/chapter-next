import { prisma } from "@/app/_libs/prisma";
import { NextResponse } from "next/server";
import { type } from "os";

// カテゴリー一覧APIのレスポンス
export type CategoriesIndexResponse = {
  categories: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json<CategoriesIndexResponse>(
      { categories },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

// カテゴリーの新規作成
export type CreateCategoryRequestBody = {
  name: string;
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { name }: CreateCategoryRequestBody = body;
    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json({
      status: "OK",
      message: "作成しました",
      id: data.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
