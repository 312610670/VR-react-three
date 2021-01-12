import React from 'react';
import { generate, blue } from '@ant-design/colors';
import styleString from './antResetStyle';
import { hexToRgb } from '../../utils/colorUtils';

interface AntResetStyleProps {
  primaryColor?: string;
}

const AntResetStyle: React.FC<AntResetStyleProps> = ({ primaryColor }) => {
  let colors = blue;

  if (primaryColor && /^#[0-9a-f]{6}$/i.test(primaryColor)) {
    colors = generate(primaryColor);
  }
  colors.push(hexToRgb(colors[5]));
  let style = styleString.replace(/@primary10/g, (a, b) => {
    return colors[10];
  });
  style = style.replace(/@primary([0-9])/g, (a, b) => {
    return colors[b];
  });
  return <style dangerouslySetInnerHTML={{ __html: style }} />;
};

export default AntResetStyle;
