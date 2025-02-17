import React from 'react';
import { useSelector } from 'react-redux';

import { getMonthYearFormat } from 'loot-core/src/shared/months';
import LegacyAccountAutocomplete from 'loot-design/src/components/AccountAutocomplete';
import LegacyAutocomplete from 'loot-design/src/components/Autocomplete';
import NewCategoryAutocomplete from 'loot-design/src/components/CategoryAutocomplete';
import LegacyCategoryAutocomplete from 'loot-design/src/components/CategorySelect';
import { View, Input } from 'loot-design/src/components/common';
import DateSelect from 'loot-design/src/components/DateSelect';
import { Checkbox } from 'loot-design/src/components/forms';
import NewAccountAutocomplete from 'loot-design/src/components/NewAccountAutocomplete';
import NewAutocomplete from 'loot-design/src/components/NewAutocomplete';
import NewPayeeAutocomplete from 'loot-design/src/components/NewPayeeAutocomplete';
import LegacyPayeeAutocomplete from 'loot-design/src/components/PayeeAutocomplete';
import RecurringSchedulePicker from 'loot-design/src/components/RecurringSchedulePicker';

import useFeatureFlag from '../../hooks/useFeatureFlag';

export default function GenericInput({
  field,
  subfield,
  type,
  multi,
  value,
  inputRef,
  style,
  onChange,
}) {
  const isNewAutocompleteEnabled = useFeatureFlag('newAutocomplete');
  const PayeeAutocomplete = isNewAutocompleteEnabled
    ? NewPayeeAutocomplete
    : LegacyPayeeAutocomplete;
  const AccountAutocomplete = isNewAutocompleteEnabled
    ? NewAccountAutocomplete
    : LegacyAccountAutocomplete;
  const CategoryAutocomplete = isNewAutocompleteEnabled
    ? NewCategoryAutocomplete
    : LegacyCategoryAutocomplete;

  let { payees, accounts, categoryGroups, dateFormat } = useSelector(state => {
    return {
      payees: state.queries.payees,
      accounts: state.queries.accounts,
      categoryGroups: state.queries.categories.grouped,
      dateFormat: state.prefs.local.dateFormat || 'MM/dd/yyyy',
    };
  });

  // This makes the UI more resilient in case of faulty data
  if (multi && !Array.isArray(value)) {
    value = [];
  } else if (!multi && Array.isArray(value)) {
    return null;
  }

  let showPlaceholder = multi ? value.length === 0 : true;

  let content;
  switch (type) {
    case 'id':
      switch (field) {
        case 'payee':
          if (payees.length > 0) {
            content = (
              <PayeeAutocomplete
                payees={payees}
                accounts={accounts}
                multi={multi}
                showMakeTransfer={false}
                openOnFocus={true}
                value={value}
                onSelect={onChange}
                inputProps={{
                  inputRef,
                  ...(showPlaceholder ? { placeholder: 'nothing' } : null),
                }}
              />
            );
          }
          break;

        case 'account':
          content = (
            <AccountAutocomplete
              accounts={accounts}
              value={value}
              multi={multi}
              openOnFocus={true}
              onSelect={onChange}
              inputProps={{
                inputRef,
                ...(showPlaceholder ? { placeholder: 'nothing' } : null),
              }}
            />
          );
          break;

        case 'category':
          content = (
            <CategoryAutocomplete
              categoryGroups={categoryGroups}
              value={value}
              multi={multi}
              openOnFocus={true}
              onSelect={onChange}
              inputProps={{
                inputRef,
                ...(showPlaceholder ? { placeholder: 'nothing' } : null),
              }}
            />
          );
          break;

        default:
      }
      break;

    case 'date':
      switch (subfield) {
        case 'month':
          content = (
            <Input
              inputRef={inputRef}
              defaultValue={value || ''}
              placeholder={getMonthYearFormat(dateFormat).toLowerCase()}
              onEnter={e => onChange(e.target.value)}
              onBlur={e => onChange(e.target.value)}
            />
          );
          break;

        case 'year':
          content = (
            <Input
              inputRef={inputRef}
              defaultValue={value || ''}
              placeholder={'yyyy'}
              onEnter={e => onChange(e.target.value)}
              onBlur={e => onChange(e.target.value)}
            />
          );
          break;

        default:
          if (value && value.frequency) {
            content = (
              <RecurringSchedulePicker
                value={value}
                buttonStyle={{ justifyContent: 'flex-start' }}
                onChange={onChange}
              />
            );
          } else {
            content = (
              <DateSelect
                value={value}
                dateFormat={dateFormat}
                openOnFocus={false}
                inputRef={inputRef}
                inputProps={{ placeholder: dateFormat.toLowerCase() }}
                onSelect={onChange}
              />
            );
          }
          break;
      }
      break;

    case 'boolean':
      content = (
        <Checkbox
          checked={value}
          value={value}
          onChange={() => onChange(!value)}
        />
      );
      break;

    default:
      if (multi) {
        content = isNewAutocompleteEnabled ? (
          <NewAutocomplete
            ref={inputRef}
            isMulti
            isCreatable
            formatCreateLabel={inputValue => `Add "${inputValue}"`}
            noOptionsMessage={() => null}
            value={value.map(v => ({ value: v, label: v }))}
            onSelect={onChange}
            onCreateOption={selected => onChange([...value, selected])}
          />
        ) : (
          <LegacyAutocomplete
            multi={true}
            suggestions={[]}
            value={value}
            inputProps={{ inputRef }}
            onSelect={onChange}
          />
        );
      } else {
        content = (
          <Input
            inputRef={inputRef}
            defaultValue={value || ''}
            placeholder="nothing"
            onEnter={e => onChange(e.target.value)}
            onBlur={e => onChange(e.target.value)}
          />
        );
      }
      break;
  }

  return <View style={[{ flex: 1 }, style]}>{content}</View>;
}
