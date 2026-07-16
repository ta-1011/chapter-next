import { Category } from "@/app/api/admin/posts/[id]/route";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  selectedCategories: Category[];
  setSelectedCategories: (categories: Category[]) => void;
  disabled: boolean;
}

export const CategoriesSelect: React.FC<Props> = ({
  selectedCategories,
  setSelectedCategories,
  disabled,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  // カテゴリーをクリックしたときに呼び出される
  const clickCategory = (id: number) => {
    if (disabled) return;

    // すでに選択されているか調べる
    const exists = selectedCategories.some(
      (selectedCategory) => selectedCategory.id === id
    );
    if (disabled) return;

    // 選択済みなら解除
    if (exists) {
      setSelectedCategories(
        selectedCategories.filter(
          (selectedCategory) => selectedCategory.id !== id
        )
      );
      return;
    }

    // find()でクリックされたカテゴリを探す
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    // クリックしたカテゴリを「選択済みカテゴリ」に追加
    setSelectedCategories([...selectedCategories, category]);
  };

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories);
    };
    fetcher();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          // 選択されているか確認
          const isSelected = selectedCategories.some(
            (selected) => selected.id === category.id
          );
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => clickCategory(category.id)}
              className={[
                "rounded-full border px-3 py-1 text-sm transition-colors",
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-gray-100 text-gray-800 hover:bg-gray-50",
              ].join(" ")}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
