import * as {{ camelCase name }}Actions from '{{ position }}/{{ kebabCase name }}.actions';

export interface State {
  loading: boolean;
  entities: { [id: string]: any };
  result: string[];
}

export const initialState: State = {
  loading: false,
  entities: {},
  result: []
}

export function reducer(state = initialState, action: {{ camelCase name }}Actions.All): State {
  switch (action.type) {
    case {{ camelCase name }}Actions.LOAD: {
      return {
        ...state,
        loading: true
      }
    }

    case {{ camelCase name }}Actions.LOAD_SUCCESS: {

      return {
        ...state,
        loading: false,
      };
    }

     case {{ camelCase name }}Actions.LOAD_FAIL: {

      return {
        ...state,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}