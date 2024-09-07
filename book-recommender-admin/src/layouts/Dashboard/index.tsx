import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import StatisticCard from '../../components/Card/StatisticCard'
import DashboardTable from '../../components/Table/DashboardTable'
import { BookApi, DashboardApi } from '../../services'
import { IBook } from '../../types'
import dayjs from 'dayjs'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement)

const DashboardLayout = () => {
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
      left: true,
      style: {
        filed: 'title',
        width: '1000px'
      }
    },
    {
      id: 'author',
      sortTable: true,
      label: 'Author',
      sortBy: 'author',
      left: true,
      style: {
        filed: 'author',
        width: '200px'
      }
    },
    {
      id: 'averageRating',
      sortTable: true,
      label: 'Rating score',
      sortBy: 'averageRating',
      left: true,
      style: {
        filed: 'averageRating',
        width: '500px'
      }
    },
    {
      id: 'numberOfRatings',
      sortTable: true,
      label: 'Number of ratings',
      sortBy: 'numberOfRatings',
      left: true,
      style: {
        filed: 'numberOfRatings',
        width: '200px'
      }
    }
  ]

  const [topRatedBooks, setTopRatedBooks] = useState([])
  const [mostRatedBooks, setMostRatedBooks] = useState([])
  const [numberOfBooks, setNumberOfBooks] = useState({
    bookCrossing: 0,
    goodreads: 0,
    thriftBooks: 0
  })
  const [numberOfGenders, setNumberOfGenders] = useState({
    male: 0,
    female: 0,
    other: 0
  })
  const [ctrIndexes, setCtrIndexes] = useState({
    contentBased: 0,
    collaborative: 0
  })
  const [clicksImpressions, setClicksImpressions] = useState({
    clicksContentBased: 0,
    clicksCollaborative: 0,
    impressionsContentBased: 0,
    impressionsCollaborative: 0
  })
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0)
  const [crawlData, setCrawlData] = useState<number[]>([])
  const [loading, setLoading] = useState({
    topRatedBooks: false,
    mostRatedBooks: false
  })

  useEffect(() => {
    const getTopRatedBooks = async () => {
      setLoading((prevState) => ({ ...prevState, topRatedBooks: true }))
      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 5,
          order: 'averageRating:desc'
        })
        if (response?.data.data && response?.data.data.length !== 0) {
          const formattedData = response?.data?.data.map((e: IBook) => {
            return {
              ...e,
              author: e.authors?.map((element: any) => element?.author?.name),
              releaseDate: e.releaseDate ? dayjs(e.releaseDate).format('DD/MM/YYYY') : '',
              source: e.source ? e.source.name : ''
            }
          })
          setTopRatedBooks(formattedData)
        }
      } catch (err) {
        setTopRatedBooks([])
      } finally {
        setLoading((prevState) => ({ ...prevState, topRatedBooks: false }))
      }
    }
    const getMostRatedBooks = async () => {
      setLoading((prevState) => ({ ...prevState, mostRatedBooks: true }))

      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 5,
          order: 'numberOfRatings:desc'
        })
        if (response?.data.data && response?.data.data.length !== 0) {
          const formattedData = response?.data?.data.map((e: IBook) => {
            return {
              ...e,
              author: e.authors?.map((element: any) => element?.author?.name),
              releaseDate: e.releaseDate ? dayjs(e.releaseDate).format('DD/MM/YYYY') : '',
              source: e.source ? e.source.name : ''
            }
          })
          setMostRatedBooks(formattedData)
        }
      } catch (err) {
        setMostRatedBooks([])
      } finally {
        setLoading((prevState) => ({ ...prevState, mostRatedBooks: false }))
      }
    }
    const getStatistics = async () => {
      try {
        const response = await DashboardApi.getCardStatistics()
        const updatedNumberOfBooks = {
          bookCrossing: response.data.sources.find((item: any) => item.name === 'Book Crossing')?.numberOfBooks || 0,
          goodreads: response.data.sources.find((item: any) => item.name === 'GoodReads')?.numberOfBooks || 0,
          thriftBooks: response.data.sources.find((item: any) => item.name === 'Thrift Books')?.numberOfBooks || 0
        }

        setNumberOfBooks(updatedNumberOfBooks)
        setNumberOfUsers(response.data.numberOfUsers)
      } catch (err) {
        setNumberOfBooks({
          bookCrossing: 0,
          goodreads: 0,
          thriftBooks: 0
        })
        setNumberOfUsers(0)
      }
    }
    const getGenderDistribution = async () => {
      try {
        const response = await DashboardApi.getUserStatistics()
        const updatedNumberOfGenders = {
          male: response.data.find((item: any) => item.gender === 'MALE')?.count || 0,
          female: response.data.find((item: any) => item.gender === 'FEMALE')?.count || 0,
          other: response.data.find((item: any) => item.gender === 'OTHER')?.count || 0
        }
        setNumberOfGenders(updatedNumberOfGenders)
      } catch (err) {
        setNumberOfGenders({
          male: 0,
          female: 0,
          other: 0
        })
      }
    }
   
}

// export default DashboardLayout
