import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import ReusableTable from '../../components/Table'
import Input from '../../components/Input'
import { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import { Typography } from '@mui/material'
import { CommonDeleteDialog } from '../../components/Dialog/DeleteDialog/CommonDeleteDialog'
import { IBook } from '../../types'
import { BookApi, DashboardApi } from '../../services'
import dayjs from 'dayjs'
import { convertDateFormat, removeEmptyFields } from '../../utils/function'
import { toast } from 'react-toastify'

const BookLayout = ({ navigate, location }: any) => {
  const columns = [
    {
      id: 'Id',
      sortTable: false,
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '70px'
      }
    },
    {
      id: 'title',
      sortTable: true,
      label: 'Title',
      sortBy: 'title',
      left: false,
      style: {
        filed: 'title',
        width: '200px'
      }
    },
    {
      id: 'author',
      sortTable: false,
      label: 'Author',
      sortBy: 'author',
      left: false,
      style: {
        filed: 'author',
        width: '150px'
      }
    },
    {
      id: 'releaseDate',
      sortTable: false,
      label: 'Release date',
      sortBy: 'releaseDate',
      left: false,
      style: {
        filed: 'releaseDate',
        width: '150px'
      }
    },
    {
      id: 'source',
      sortTable: false,
      label: 'Source',
      sortBy: 'source',
      left: false,
      style: {
        filed: 'source',
        width: '150px'
      }
    }
  ]

  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)

  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  const [sortValue, setSortValue] = useState<string | ''>('')

  const [books, setBooks] = useState<IBook[]>([])
  const [totalBooks, setTotalBooks] = useState<number>(0)

  const [totalItemsOnCurrentPage, setTotalItemsOnCurrentPage] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const [warningMessage, setWarningMessage] = useState('')
  const [deleteRowData, setDeleteRowData] = useState<{ [key: string]: any }>()

  const [latestDate, setLatestDate] = useState('')

  const isSetPageURL = useRef(false)

  const getAll = useCallback(async (parameter: any) => {
    const response = await BookApi.getBooks(parameter)

    if (response?.data.data && response?.data.data.length !== 0) {
      const formattedData = response?.data?.data.map((e: IBook) => {
        return {
          ...e,
          author: e.authors?.map((element: any) => element?.author?.name),
          releaseDate: e.releaseDate ? dayjs(e.releaseDate).format('DD/MM/YYYY') : '',
          source: e.source ? e.source.name : ''
        }
      })
      setBooks(formattedData)
      setTotalItemsOnCurrentPage(formattedData.length)
    } else {
      setBooks([])
      setTotalItemsOnCurrentPage(0)
    }
    setTotalBooks(response.data.meta.total)
    setLoading(false)
  }, [])

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    isSetPageURL.current = false
    setUpdate((prev) => !prev)
  }

  // Delay the execution of search
  const debounceSearch = useDebounce({
    value: searchText,
    ms: 800
  })

  const handleEdit = useCallback((rowData: { [key: string]: any }) => {}, [])

  const handleDelete = useCallback(async (rowData: { [key: string]: any }) => {
    const { title } = rowData
    setWarningMessage(
      `Are you sure you want to delete the book with the title 
        <span style="font-weight: 600">'${title}'</span>?`
    )
    try {
      setIsDeleteDialogOpen(true)
      setDeleteRowData(rowData)
    } catch (err: any) {
      toast.error(err?.message)
    }
  }, [])

}

export default withBaseLogic(BookLayout)
