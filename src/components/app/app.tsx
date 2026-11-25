import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

type TActiveModal =
  | { type: 'ingredient'; ingredient: TIngredient }
  | { type: 'order' }
  | null;

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<TActiveModal>(null);
  const closeModal = useCallback((): void => {
    setActiveModal(null);
  }, []);

  const openIngredientModal = useCallback((ingredient: TIngredient): void => {
    setActiveModal({ type: 'ingredient', ingredient });
  }, []);
  const openOrderModal = useCallback((): void => {
    setActiveModal({ type: 'order' });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadIngredients = async (): Promise<void> => {
      try {
        const data = await getIngredients(controller.signal);
        if (!controller.signal.aborted) {
          setIngredients(data);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError('Не удалось загрузить ингредиенты. Попробуйте обновить страницу.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadIngredients();

    return (): void => {
      controller.abort();
    };
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <h1 className="text text_type_main-large mt-10 mb-5">Соберите бургер</h1>
        {isLoading ? (
          <div
            className={styles.status}
            role="status"
            aria-label="Загрузка ингредиентов"
          >
            <Preloader />
          </div>
        ) : error ? (
          <p className={`${styles.status} text text_type_main-default`} role="alert">
            {error}
          </p>
        ) : (
          <div className={styles.columns}>
            <BurgerIngredients
              ingredients={ingredients}
              onIngredientClick={openIngredientModal}
            />
            <BurgerConstructor ingredients={ingredients} onOrderClick={openOrderModal} />
          </div>
        )}
      </main>
      {activeModal?.type === 'ingredient' && (
        <Modal title="Детали ингредиента" onClose={closeModal}>
          <IngredientDetails ingredient={activeModal.ingredient} />
        </Modal>
      )}
      {activeModal?.type === 'order' && (
        <Modal ariaLabel="Заказ оформлен" onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;
