import clock from "../../images/clock.jpg"

const Home = () => {
  return (
    <>
      <section className="p-2" style={{ height: "80vh", overflow: "hidden", backgroundColor: "#F8D501" }}>
        <img src={clock} alt="clock" style={{ width: "100%" }} />
        <p style={{ textAlign: "justify", textIndent: "20px", paddingTop: "10px" }}>
          Time is a currency we can never earn back. It's a relentless river flowing without pause,
          reminding us of its infinite power. In its silent whispers, we find the rhythm of our lives.
          Each tick of the clock carries the weight of a moment, an opportunity, a chance to make a difference.
          Embrace each second, for it's not just a unit on a clock; it's a fragment of existence, a canvas for your deeds.
          Let time be your guide, your muse, and your motivation. In the tapestry of life, it weaves the story of our journey,
          reminding us that every passing moment is a gift, a chance to shape our destiny
        </p>
      </section>
    </>
  )
}

export default Home
