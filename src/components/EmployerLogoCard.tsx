interface Props {
  name: string
}

export default function EmployerLogoCard({ name }: Props) {
  return (
    <span className="text-2xl font-bold text-gray-300 tracking-tight select-none">
      {name}
    </span>
  )
}
