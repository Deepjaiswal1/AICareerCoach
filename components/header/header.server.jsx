import { checkUser } from "@/lib/checkUser.server"
import HeaderClient from "./header.client"

const Header = async () => {
  await checkUser()
  return <HeaderClient />
}

// export default function Header() {
//   return <HeaderClient />
// }

export default Header
