// @flow

import { useReducer, type ComponentType } from 'react';
import uuid from 'uuid/v4';

export type itemType = {|
  id: string,
  type:
    | 'none'
    | 'only-drag'
    | 'only-drop-to-add'
    | 'only-drop-to-remove'
    | 'drag-and-drop',
|};

export type sourceType = $ReadOnlyArray<{|
  id: string,
  parentId: string | null,
  kind: $PropertyType<itemType, 'type'>,
  type: string | ComponentType<*>,
  props?: {},
|}>;

type stateType = {|
  previewId: false | string,
  source: sourceType,
|};

type actionType =
  | 'none'
  | 'add-preview-component'
  | 'add-component'
  | 'remove-component';

type updateSourceOptionType = 'drop' | 'hover';

/**
 * @example
 * sourceReducer(prevState, { type: 'add', current: current, target: target } })
 *
 * @param {sourceType} state - the prevState of the source data
 * @param {object} action - the action data to trigger the reducer
 *
 * @return {sourceType} - the new state of the source data
 */
const sourceReducer = (
  { previewId, source }: stateType,
  {
    type,
    current,
    target,
  }: {|
    type: actionType,
    current: itemType,
    target: itemType,
  |},
): stateType => {
  switch (type) {
    case 'add-preview-component': {
      if (!previewId) {
        const id = uuid();

        return {
          previewId: id,
          source: [
            ...source,
            // TODO: preview component
          ],
        };
      }

      const newSource = [...source];
      const preview = newSource.find(
        ({ id }: $ElementType<sourceType, number>) => id === current.id,
      );

      if (preview) preview.parentId = target.id;

      return {
        previewId,
        source: newSource,
      };
    }

    case 'add-component':
      return {
        previewId: false,
        source: source.map(
          ({ id, kind, ...data }: $ElementType<sourceType, number>) => ({
            ...data,
            id,
            kind: id !== previewId ? kind : 'drag-and-drop',
          }),
        ),
      };

    case 'remove-component':
      return {
        previewId,
        source: source.filter(
          ({ id }: $ElementType<sourceType, number>) => id !== current.id,
        ),
      };

    default:
      return {
        previewId,
        source,
      };
  }
};

/**
 * @example
 * getUpdateType('drop', current, target)
 *
 * @param {updateSourceOptionType} type - the originial type of updating the source
 * @param {itemType} current - the current item
 * @param {itemType} target - the target item
 *
 * @return {actionType} - the type of updating the source
 */
const getUpdateType = (
  type: updateSourceOptionType,
  current: itemType,
  target: itemType,
): actionType => {
  if (
    ['only-drop-to-add', 'only-drop-to-remove', 'none'].includes(
      current.type,
    ) ||
    ['only-drag', 'none'].includes(target.type)
  )
    return 'none';

  if (type === 'hover') return 'add-preview-component';

  if (target.type === 'only-drop-to-remove') return 'remove-component';

  return 'add-component';
};

/**
 * @example
 * useSource([])
 *
 * @param {sourceType} initialSource - the initial source
 *
 * @return {object} - the source data and the methods to modify the source
 */
export default (
  initialSource: sourceType,
): {|
  source: sourceType,
  updateSource: (
    type: updateSourceOptionType,
    current: itemType,
    target: itemType,
  ) => void,
|} => {
  const [{ source }, sourceDispatch] = useReducer(sourceReducer, {
    previewId: false,
    source: initialSource,
  });

  return {
    source,
    updateSource: (
      type: updateSourceOptionType,
      current: itemType,
      target: itemType,
    ) =>
      sourceDispatch({
        type: getUpdateType(type, current, target),
        current,
        target,
      }),
  };
};
