import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Form, Button } from "react-bootstrap"

const SearchBox = () => {
    const navigate = useNavigate()
    const { keyword } = useParams()
    const [searchKeyword, setSearchKeyword] = useState(keyword || '')

    const handleSearch = (ev) => {
        ev.preventDefault()
        if(searchKeyword.trim()) {
            setSearchKeyword('')
            navigate(`/search/${searchKeyword}`)
        } else {
            navigate('/')
        }
    }

  return (
    <div>
        <Form onSubmit={handleSearch} className="d-flex">
            <Form.Control
                type="text"
                name="q"
                value={searchKeyword}
                onChange={(ev) => setSearchKeyword(ev.target.value)}
                placeholder="Search Products..."
                className="mr-sm-2 ml-sm-5"
            ></Form.Control>
            <Button type="submit" variant="outline-light" className="p-2 mx-2">
                Search
            </Button>
        </Form>
    </div>
  )
}

export default SearchBox