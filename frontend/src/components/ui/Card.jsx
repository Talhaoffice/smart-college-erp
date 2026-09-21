import { cn } from '../../lib/utils.js'

function Card({
  as: Tag = 'section',
  className = '',
  subtle = false,
  hoverable = false,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(
        'card',
        subtle ? 'card-muted' : '',
        hoverable ? 'card-hover' : '',
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default Card
