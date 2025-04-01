import { Dispatch, SetStateAction } from "react";

type Simplify<T> = {
  [K in keyof T]: T[K];
} & {};

type GStateOptions<State, Params, Result = State> = Simplify<
  {
    select?: (state: State) => Result;
  } & (Params extends undefined ? object : { params: Params })
>;

type GState<State, Params> = {
  <Result = State>(options: GStateOptions<State, Params, Result>): Result;
};

export declare function createGState<State, Params = undefined>(
  fn: (params: Params) => State
): GState<State, Params>;

export declare function useGState<T>(def: T): [T, Dispatch<SetStateAction<T>>];
export declare function useGState<T>(): [
  T | undefined,
  Dispatch<SetStateAction<T>>
];
