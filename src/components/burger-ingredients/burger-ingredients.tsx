import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

const categories = [
  { type: 'bun', title: 'Булки' },
  { type: 'sauce', title: 'Соусы' },
  { type: 'main', title: 'Начинки' },
];

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [activeTab, setActiveTab] = useState('bun');
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const ingredientGroups = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        items: ingredients.filter((ingredient) => ingredient.type === category.type),
      })),
    [ingredients]
  );

  const selectedBun = ingredientGroups[0].items[0];

  const selectCategory = useCallback((type: string): void => {
    const container = scrollRef.current;
    const section = sectionRefs.current[type];

    if (container && section) {
      container.scrollTo({
        top:
          section.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop,
        behavior: 'smooth',
      });
    }
    setActiveTab(type);
  }, []);

  const updateActiveTab = useCallback((): void => {
    const container = scrollRef.current;
    if (!container) return;

    const top = container.getBoundingClientRect().top;
    let current = categories[0].type;

    for (const { type } of categories) {
      const section = sectionRefs.current[type];
      if (section && section.getBoundingClientRect().top <= top + 48) {
        current = type;
      }
    }
    setActiveTab(current);
  }, []);

  return (
    <section className={styles.burger_ingredients} aria-label="Ингредиенты">
      <nav aria-label="Категории ингредиентов">
        <ul className={styles.menu}>
          {categories.map(({ type, title }) => (
            <li key={type}>
              <Tab value={type} active={activeTab === type} onClick={selectCategory}>
                {title}
              </Tab>
            </li>
          ))}
        </ul>
      </nav>
      <div
        ref={scrollRef}
        className={`${styles.ingredients} custom-scroll mt-10`}
        onScroll={updateActiveTab}
        tabIndex={0}
        aria-label="Список ингредиентов"
      >
        {ingredientGroups.map(({ type, title, items }) => (
          <section
            key={type}
            ref={(element) => {
              sectionRefs.current[type] = element;
            }}
            aria-labelledby={`category-${type}`}
            className="mb-10"
          >
            <h2 id={`category-${type}`} className="text text_type_main-medium mb-6">
              {title}
            </h2>
            <ul className={`${styles.cards} pl-4 pr-4`}>
              {items.map((ingredient) => {
                const count =
                  type === 'bun' ? (ingredient._id === selectedBun?._id ? 2 : 0) : 1;

                return (
                  <li key={ingredient._id}>
                    <button
                      type="button"
                      className={styles.card}
                      aria-label={`Подробнее: ${ingredient.name}`}
                      onClick={() => {
                        onIngredientClick(ingredient);
                      }}
                    >
                      {count > 0 && <Counter count={count} size="default" />}
                      <img
                        className={styles.image}
                        src={ingredient.image}
                        alt={ingredient.name}
                        width={240}
                        height={120}
                      />
                      <p
                        className={`${styles.price} text text_type_digits-default mt-2 mb-2`}
                      >
                        {ingredient.price}
                        <CurrencyIcon type="primary" />
                      </p>
                      <p className="text text_type_main-default">{ingredient.name}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
};
