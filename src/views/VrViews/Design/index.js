import React from 'react';
import styled from 'styled-components';
import Preview from './Perviews/index'
import Edit from './Edit/index'
import Header from './Header/index'
// import { Button } from 'antd';
import reducer from './reducers.js';
import { injectReducer } from 'reducers';
// import { Switch, Route, Redirect } from 'react-router-dom';


injectReducer('vrData',reducer)

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Contenet = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const SidebarWrap = styled.div`
  flex: 0 0 248px;
  width: 248px;
  overflow: auto;
  .ant-tabs {
    overflow: initial !important;
  }
`;

const PreviewWrap = styled.div`
  flex: 1;
  width: 100%;
  overflow: auto;
`;

const Design = () => {
  return (
    <Container>
      <Header />
      <Contenet>
        <SidebarWrap>
          <Edit/>
        </SidebarWrap>
        <PreviewWrap>
          <Preview />
        </PreviewWrap>
      </Contenet>
    </Container>
  )
}

export default Design