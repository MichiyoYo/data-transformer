/**
 * Core transformer function type that takes an input of type TInput and returns TOutput.
 *
 * @template TInput - The type of the input data
 * @template TOutput - The type of the transformed output data
 *
 * @example
 * ```typescript
 * const stringToNumber: Transformer<string, number> = (str) => parseInt(str, 10);
 * ```
 */
export type Transformer<TInput, TOutput> = (input: TInput) => TOutput;

/**
 * Utility type for transforming arrays while preserving the array structure.
 *
 * @template TInput - The type of elements in the input array
 * @template TOutput - The type of elements in the output array
 *
 * @example
 * ```typescript
 * const numbersToStrings: ArrayTransformer<number, string> = (nums) => nums.map(String);
 * ```
 */
export type ArrayTransformer<TInput, TOutput> = Transformer<
  TInput[],
  TOutput[]
>;

/**
 * Utility type for transforming specific fields within objects.
 *
 * @template TObject - The object type containing the field
 * @template TKey - The key of the field to transform
 * @template TOutput - The type of the transformed field value
 *
 * @example
 * ```typescript
 * const dateStringToDate: FieldTransformer<{createdAt: string}, 'createdAt', Date> =
 *   (dateStr) => new Date(dateStr);
 * ```
 */
export type FieldTransformer<
  TObject,
  TKey extends keyof TObject,
  TOutput
> = Transformer<TObject[TKey], TOutput>;

/**
 * Transforms data from API format to UI format (inbound transformation).
 *
 * @template TApiData - The shape of data from the API/backend
 * @template TUiData - The shape of data expected by the UI
 */
export type InboundAdapter<TApiData, TUiData> = Transformer<TApiData, TUiData>;

/**
 * Transforms data from UI format to API format (outbound transformation).
 *
 * @template TUiData - The shape of data from the UI
 * @template TApiData - The shape of data expected by the API/backend
 */
export type OutboundAdapter<TUiData, TApiData> = Transformer<TUiData, TApiData>;

/**
 * A bidirectional adapter that can transform data in both directions.
 *
 * @template TApiData - The API data shape
 * @template TUiData - The UI data shape
 */
export interface BidirectionalAdapter<TApiData, TUiData> {
  /** Transform API data to UI format */
  toUi: InboundAdapter<TApiData, TUiData>;
  /** Transform UI data to API format */
  toApi: OutboundAdapter<TUiData, TApiData>;
}
