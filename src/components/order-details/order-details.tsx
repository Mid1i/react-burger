import orderSuccess from '@/assets/images/order-success.svg';

import { MOCK_ORDER_NUMBER } from '@utils/order';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => (
  <div className={`${styles.details} pt-20 pb-20`}>
    <p className={`${styles.number} text text_type_digits-large`}>{MOCK_ORDER_NUMBER}</p>
    <p className="text text_type_main-medium mt-8">идентификатор заказа</p>
    <div className={`${styles.success} mt-15 mb-15`}>
      <img src={orderSuccess} alt="Заказ подтверждён" width={107} height={102} />
    </div>
    <p className="text text_type_main-default">Ваш заказ начали готовить</p>
    <p className="text text_type_main-default text_color_inactive mt-2">
      Дождитесь готовности на орбитальной станции
    </p>
  </div>
);
