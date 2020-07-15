import React from 'react';
import _ from 'lodash';

import { safePrefix, markdownify } from '../utils';
import StartForm from './StartForm';
import styled from 'styled-components';

export default class SectionHero extends React.Component {
  render() {
    let section = _.get(this.props, 'section', null);
    return (
      <section
        id={_.get(section, 'section_id', null)}
        className='block hero-block bg-accent outer'
      >
        <div className='inner'>
          <div className='grid'>
            {_.get(section, 'image', null) && (
              <div className='cell block-preview'>
                <img
                  src={safePrefix(_.get(section, 'image', null))}
                  alt={_.get(section, 'title', null)}
                />
              </div>
            )}
            <div className='cell block-content'>
              {_.get(section, 'title', null) && (
                <Title className='block-title underline'>
                  {_.get(section, 'title', null)}
                </Title>
              )}
              <div className='block-copy'>
                <Subtitle>
                  {markdownify(_.get(section, 'content', null))}
                </Subtitle>
              </div>
              <StartForm {...this.props} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const Title = styled.h2`
  line-height: 2.5rem;
  margin-bottom: 1.5rem !important;
`;

const Subtitle = styled.div`
  line-height: 1.4rem;
  margin-bottom: 3rem !important;
  color: hsl(122, 34%, 90%);
`;
