import styles from "@/styles/m/Categories.module.scss";
import { getCategories } from "@/api/getCategories";
import { LoadingSpinner, SearchBar, SearchMenu } from "@/components";
import { Save, Trash2, X } from "react-feather";
import { useQuery } from "react-query";
import { updateCategory } from "@/api";
import { useEffect, useState } from "react";
import { Tag } from "@/types";

export async function getServerSideProps() {
  return { props: {} };
}

export default function Categories() {
  const [categories, setCategories] = useState<Tag[]>([]);
  const [response, setResponse] = useState<{
    success: boolean;
    message: string;
  }>({ success: false, message: "" });

  const CategoryData = useQuery({
    queryKey: ["@categories"],
    queryFn: getCategories,
    refetchOnWindowFocus: true,
  });

  const onUpdateCategory = async (index: number) => {
    const res = await updateCategory(categories[index]);
    setResponse(res);
  };

  useEffect(() => {
    if (CategoryData.isSuccess) {
      setCategories(CategoryData.data);
    }
  }, [CategoryData.data, CategoryData.isSuccess]);

  return (
    <>
      <div className="container">
        <header className="main-header">
          <h1>Edit Categories</h1>
        </header>

        <SearchMenu>
          <SearchBar onChangeFn={(e) => null} />
        </SearchMenu>

        {response.message && (
          <span
            className={`banner ${response.success ? "success" : "failure"}`}
          >
            {response.message}
            <button
              onClick={() => setResponse({ success: false, message: "" })}
            >
              <X />
            </button>
          </span>
        )}

        <section>
          {CategoryData.isLoading ? (
            <LoadingSpinner />
          ) : (
            <ul className={styles.tagList}>
              {categories &&
                categories.map((category, index) => (
                  <li key={category.id}>
                    <input
                      type="text"
                      defaultValue={category.description}
                      onChange={(e) =>
                        setCategories([
                          ...categories.slice(0, index),
                          {
                            ...categories[index],
                            description: e.target.value,
                          },
                          ...categories.slice(index + 1),
                        ])
                      }
                    />
                    <input
                      type="number"
                      defaultValue={category.relevance}
                      min={0}
                      max={100}
                      onChange={(e) =>
                        setCategories([
                          ...categories.slice(0, index),
                          {
                            ...categories[index],
                            relevance: Number(e.target.value),
                          },
                          ...categories.slice(index + 1),
                        ])
                      }
                    />
                    <button
                      title={`Save Category ${category.description}`}
                      onClick={() => onUpdateCategory(index)}
                    >
                      <Save />
                    </button>
                    <button
                      className="danger"
                      title={`Delete Category ${category.description}`}
                    >
                      <Trash2 />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
