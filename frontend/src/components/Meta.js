import { Helmet } from "react-helmet-async"

const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
        <meta name='keyword' content={keywords}/>
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to Shifu Watches',
    description: 'We sell the best products for cheap',
    keywords: 'watches, luxury watches, cheap watches'
}

export default Meta