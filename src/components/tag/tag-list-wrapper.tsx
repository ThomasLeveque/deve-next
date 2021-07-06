import classNames from 'classnames';
import React from 'react';

const TagListWrapper: React.FC<{ className?: string }> = (props) => {
  return (
    <ul className={classNames('flex flex-wrap gap-[10px] gap-y-3', props.className)}>
      {props.children}
    </ul>
  );
};

export default TagListWrapper;
