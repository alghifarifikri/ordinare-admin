/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { CRow, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { Table, message } from 'antd'
import axios from 'axios'

const Resto = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const columns = [
    {
      title: 'Asal Produk',
      dataIndex: 'name_resto',
      key: 'name_resto',
    },
    {
      title: 'Deskripsi',
      dataIndex: 'descriptions',
      key: 'descriptions',
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`http://localhost:4040/admin_app/restaurantdata`)
      if (response.status === 200) {
        setDataTable(response.data)
        setIsLoading(false)
      }
    } catch (e) {
      console.log({ e })
      setIsLoading(false)
      message.error('Gagal Mendapatkan Data Produk')
    }
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>Daftar Mitra / Resto</CCardHeader>
        <CCardBody>
          <CRow>
            <Table columns={columns} dataSource={dataTable} loading={isLoading} />
          </CRow>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Resto
