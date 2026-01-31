import { useState, useEffect } from 'react'

export const useStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F
  // กำหนดค่าเริ่มต้นเป็น undefined เพื่อแยกความต่างจาก null (ที่แปลว่าไม่มีข้อมูล)
  const [data, setData] = useState<F | undefined>(undefined)

  useEffect(() => {
    setData(result)
  }, [result])

  return data
}