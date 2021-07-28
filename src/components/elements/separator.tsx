import classNames from 'classnames';
import React from 'react';

const Separator: React.FC<{ className?: string }> = React.memo((props) => (
  <div className={classNames('w-full h-[1px] bg-gray-400/30', props.className)} />
));

export default Separator;
