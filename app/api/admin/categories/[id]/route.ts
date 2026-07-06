import { prisma } from "@/app/_libs/prisma";
import { NextResponse, NextRequest } from "next/server";

// ---------- カテゴリー詳細APIのレスポンス ----------
export type CategoryShowResponse = {
  category: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!category) {
      return NextResponse.json(
        { message: "カテゴリーが見つかりません。" },
        { status: 404 }
      );
    }
    return NextResponse.json<CategoryShowResponse>(
      { category },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
// ---------- カテゴリー更新 ----------
export type UpdateCategoryRequestBody = {
  name: string;
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> } //// ここでリクエストパラメータを受け取る
) => {
  // paramsの中にidが入っているので、それを取り出す
  const { id } = await params;
  // リクエストのbodyを取得
  const { name }: UpdateCategoryRequestBody = await request.json();
  try {
    // idを指定して、Categoryを更新
    await prisma.category.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
      },
    });
    return NextResponse.json({ message: "OK" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message }, { status: 400 });
  }
};
