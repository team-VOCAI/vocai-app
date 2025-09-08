import React from 'react';

export default function ContainerX({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='max-w-5xl mx-auto w-full px-4 md:px-8'>{children}</div>
  );
}
