import classNames from 'classnames';
import React from 'react';

const Separator: React.FC<{ className?: string }> = React.memo((props) => (
  <div className={classNames('h-[1px] w-full bg-gray-400/30', props.className)} />
));

export default Separator;
