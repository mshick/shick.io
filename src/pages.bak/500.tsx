import { ErrorMessage } from '#/components/Error/ErrorMessage'
import Layout from '#/layouts/Default'

export default function Custom500() {
  return (
    <Layout seo={{ title: 'Server error' }}>
      <ErrorMessage
        headline="500 error"
        subhead="Server error"
        body="Sorry, we had an unexpected error."
      />
    </Layout>
  )
}
