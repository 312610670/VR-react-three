import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import AntResetStyle from '../../components/AntResetStyle';

const AppResetStyle = () => {
  const primaryColor = useSelector(
    (state: RootState) => state.config.primaryColor
  );
  return <AntResetStyle primaryColor={primaryColor} />;
};

export default AppResetStyle;
