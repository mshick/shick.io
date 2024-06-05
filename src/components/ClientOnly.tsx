import { Fragment, PropsWithChildren, useEffect, useState } from 'react'

const ClientOnly = ({ children }: PropsWithChildren<any>) => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }
  return <Fragment>{children}</Fragment>
}

export default ClientOnly
