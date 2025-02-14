import React, { useState } from 'react';
import { Checkbox, CheckboxGroup, Stack, Text } from '@chakra-ui/react';

const categoryGroupOptions = [
  { value: '지하철역', label: '지하철역' },
  { value: '대형마트', label: '대형마트' },
  { value: '학교', label: '학교' },
  { value: '주차장', label: '주차장' },
  { value: '문화시설', label: '문화시설' },
  { value: '관광명소', label: '관광명소' },
  { value: '음식점', label: '음식점' },
  { value: '카페', label: '카페' },
  { value: '숙박', label: '숙박' },
  { value: '병원', label: '병원' },
  { value: '약국', label: '약국' },
];

const MultiSelectCategoryGroup = ({ setCategoryGroup }) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (values) => {
    // 선택된 값이 5개 이하일 때만 업데이트
    if (values.length <= 5) {
      setSelectedValues(values);
      setCategoryGroup(values);
    } else {
      // 이미 5개를 초과한 경우는 무시하거나 slice하여 5개만 유지할 수 있음
      const trimmedValues = values.slice(0, 5);
      setSelectedValues(trimmedValues);
      setCategoryGroup(trimmedValues);
    }
  };

  return (
    <div>
      <Text mb={2}>최대 5개까지 선택할 수 있습니다.</Text>
      <CheckboxGroup value={selectedValues} onChange={handleChange}>
        <Stack spacing={2} direction={['column', 'row']}>
          {categoryGroupOptions.map((option) => {
            // 이미 5개가 선택되어 있고, 현재 옵션이 선택되지 않았다면 비활성화
            const isDisabled =
              selectedValues.length >= 5 &&
              !selectedValues.includes(option.value);
            return (
              <Checkbox
                key={option.value}
                value={option.value}
                isDisabled={isDisabled}
              >
                {option.label}
              </Checkbox>
            );
          })}
        </Stack>
      </CheckboxGroup>
    </div>
  );
};

export default MultiSelectCategoryGroup;
