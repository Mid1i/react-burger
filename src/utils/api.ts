import { API_BASE_URL } from '@utils/constants';

import type { TIngredient } from '@utils/types';

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export const getIngredients = async (signal?: AbortSignal): Promise<TIngredient[]> => {
  const response = await fetch(`${API_BASE_URL}/ingredients`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to load ingredients: ${response.status}`);
  }

  const result = (await response.json()) as TIngredientsResponse;

  if (!result.success || !Array.isArray(result.data)) {
    throw new Error('The API did not return ingredients');
  }

  return result.data;
};
