import { Text, Heading } from 'theme-ui'

export default function Logo() {
  return (
    <Heading>
      <Text
        variant="default"
        sx={{
          display: 'inline',
          background: '#A321AD',
          color: 'white',
          userSelect: 'none',
        }}
      >
        michael shick
      </Text>
    </Heading>
  )
}
