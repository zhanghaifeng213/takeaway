import http from '@/libs/httpRequest'

const getInfo = params => {
  return http({
    url: http.adornUrl('/info/list'),
    method: 'get',
    params: params
  })
}

const updateInfo = data => {
  return http({
    url: http.adornUrl('/info/update'),
    method: 'post',
    data: data
  })
}

export { getInfo, updateInfo }
