import classNames from 'classnames';
import React from 'react';

const Separator: React.FC<{ className?: string }> = (props) => (
  <div className={classNames('w-full h-[1px] bg-gray-100', props.className)} />
);

export default Separator;
