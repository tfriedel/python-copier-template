from loguru import logger

from {{package_name}} import hello


def main() -> None:
    logger.info("Application started")
    print(hello())
    logger.info("Application finished")


if __name__ == "__main__":
    main()
