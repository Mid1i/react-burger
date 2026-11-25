import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const { bun, fillings, total } = useMemo(() => {
    const bun = ingredients.find((ingredient) => ingredient.type === 'bun');
    const fillings = ingredients.filter((ingredient) => ingredient.type !== 'bun');
    const total = fillings.reduce(
      (sum, ingredient) => sum + ingredient.price,
      (bun?.price ?? 0) * 2
    );

    return { bun, fillings, total };
  }, [ingredients]);

  return (
    <section
      className={`${styles.burger_constructor} pb-10`}
      aria-label="Конструктор бургера"
    >
      <div className={`${styles.stack} pl-4 pr-4`}>
        {bun && (
          <div className={`${styles.locked} ml-8`}>
            <ConstructorElement
              extraClass={styles.element}
              type="top"
              isLocked
              text={`${bun.name} (верх)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}
        <ul
          className={`${styles.fillings} custom-scroll`}
          aria-label="Начинка бургера"
          tabIndex={0}
        >
          {fillings.map((ingredient) => (
            <li key={ingredient._id} className={styles.row}>
              <DragIcon type="primary" />
              <ConstructorElement
                extraClass={styles.element}
                text={ingredient.name}
                price={ingredient.price}
                thumbnail={ingredient.image}
              />
            </li>
          ))}
        </ul>
        {bun && (
          <div className={`${styles.locked} ml-8`}>
            <ConstructorElement
              extraClass={styles.element}
              type="bottom"
              isLocked
              text={`${bun.name} (низ)`}
              price={bun.price}
              thumbnail={bun.image}
            />
          </div>
        )}
      </div>
      <div className={`${styles.checkout} mt-10 mr-4`}>
        <p
          className={`${styles.total} text text_type_digits-medium`}
          aria-label={`Стоимость заказа: ${total}`}
        >
          {total}
          <CurrencyIcon type="primary" />
        </p>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
