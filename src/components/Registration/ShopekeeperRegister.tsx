import { useState } from "react";
import { fetchFn } from "../../utils/FetchFn";

const ShopekeeperRegister: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mobile, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFormSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    async function postShopKeeper() {
      setLoading(true);
      const registerBody = { name, email, password, mobile };
      try {
        const data = await fetchFn(`/user/register/shopkeeper`, {
          method: "POST",
          body: registerBody,
        });
        console.log("Shopkeeper registered successfully: ", data);
        setName("");
        setEmail("");
        setPassword("");
        setPhone("");
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    postShopKeeper();
  };

  if (loading) {
    return <div className="w-full, h-full">Loading...</div>;
  }

  return (
    <div>
      <p>Start registering as Shop Owner</p>
      <form onSubmit={handleFormSubmit} className="flex flex-col">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Enter your name"
          required={true}
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Enter your email"
          required={true}
        />
        <input
          onChange={(e) => setPhone(e.target.value)}
          type="text"
          value={mobile}
          name=""
          id=""
          placeholder="Enter your number"
          required={true}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Enter your password"
          required={true}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ShopekeeperRegister;
