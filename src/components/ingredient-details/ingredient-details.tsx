import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const nutrients = [
    { label: 'Калории,ккал', value: ingredient.calories },
    { label: 'Белки, г', value: ingredient.proteins },
    { label: 'Жиры, г', value: ingredient.fat },
    { label: 'Углеводы, г', value: ingredient.carbohydrates },
  ];

  return (
    <div className={`${styles.details} pb-5`}>
      <img
        className={styles.image}
        src={ingredient.image_large}
        alt={ingredient.name}
        width={480}
        height={240}
      />
      <h3 className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</h3>
      <dl className={styles.nutrients}>
        {nutrients.map(({ label, value }) => (
          <div key={label}>
            <dt className="text text_type_main-default mb-2">{label}</dt>
            <dd className="text text_type_digits-default">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
