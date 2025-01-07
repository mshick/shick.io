import firstName from '#/components/Ascii/firstName.txt';
import lastName from '#/components/Ascii/lastName.txt';
import picture from '#/components/Ascii/portrait.txt';

export function HomepageHero() {
  return (
    <section
      id="hero"
      className="not-prose flex flex-col-reverse sm:flex-row sm:gap-10 my-4"
    >
      <div className="flex flex-col gap-4 items-center sm:items-start md:justify-center">
        <div className="flex flex-row gap-4 sm:flex-row sm:gap-2 sm:mx-0 text-[5px] sm:text-[6px] lg:text-[7px]">
          <pre>{firstName}</pre>
          <pre>{lastName}</pre>
        </div>
        <div className="text-xs max-w-[18rem]">
          <p>
            Software engineer and sometimes manager of software engineers.
            Building API tools at <a href="https://takeshape.io">TakeShape</a>.
          </p>
        </div>
      </div>
      <div className="flex mx-auto sm:ml-auto sm:mr-0">
        <pre className="text-[1.5px] md:text-[2px] lg:text-[2.5px] leading-none">
          {picture}
        </pre>
      </div>
    </section>
  );
}
